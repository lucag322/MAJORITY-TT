"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useDebounce } from "@uidotdev/usehooks";
import { Country, CountryPosition } from "../types/country";

// Composant pour un drapeau individuel - Mémorisé pour éviter les re-renders inutiles
const FlagSprite = React.memo(function FlagSprite({
  countryPos,
  onClick,
  onComparisonAction,
  isHovered,
  onHover,
  onUnhover,
  focusedCountry,
  isSearchResult,
  isInComparison,
}: {
  countryPos: CountryPosition;
  onClick: (country: Country) => void;
  onComparisonAction: (country: Country) => void;
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
  focusedCountry?: CountryPosition | null;
  isSearchResult: boolean;
  isInComparison: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [scale, setScale] = useState(1);
  const [isInForeground, setIsInForeground] = useState(true);

  // Load flag texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      countryPos.country.flags.png,
      (loadedTexture) => {
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        // Fallback to default flag if loading fails
      }
    );
  }, [countryPos.country.flags.png]);

  // Rotation and scale animation
  useFrame((state) => {
    if (meshRef.current) {
      let finalRotationY;

      if (focusedCountry) {
        // Mode recherche : pas de rotation automatique, globe fixe
        finalRotationY = 0;
      } else {
        // Mode normal : rotation continue
        const time = state.clock.getElapsedTime();
        const rotationSpeed = 0.1;
        finalRotationY = time * rotationSpeed;
      }

      // Appliquer la rotation simple
      const rotationMatrix = new THREE.Matrix4().makeRotationY(finalRotationY);

      const originalPosition = new THREE.Vector3(...countryPos.position);
      const rotatedPosition = originalPosition
        .clone()
        .applyMatrix4(rotationMatrix);

      meshRef.current.position.copy(rotatedPosition);

      // Vérifier si le drapeau est au premier plan (coordonnée Z positive vers la caméra)
      const cameraDirection = new THREE.Vector3();
      state.camera.getWorldDirection(cameraDirection);
      const flagToCameraVector = new THREE.Vector3()
        .subVectors(state.camera.position, rotatedPosition)
        .normalize();

      // Si le produit scalaire est positif, le drapeau fait face à la caméra
      const dotProduct = rotatedPosition
        .clone()
        .normalize()
        .dot(flagToCameraVector);
      setIsInForeground(dotProduct > 0);

      // Face the camera
      meshRef.current.lookAt(state.camera.position);

      // Scale animation on hover and search highlighting
      const baseScale = isSearchResult ? 1.2 : 1; // Les résultats de recherche sont plus grands
      const targetScale = isHovered ? baseScale * 1.5 : baseScale;
      setScale((prev) => THREE.MathUtils.lerp(prev, targetScale, 0.1));
      meshRef.current.scale.setScalar(scale);

      // Opacity for search results
      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        const targetOpacity = isSearchResult ? 1.0 : focusedCountry ? 0.6 : 1.0;
        meshRef.current.material.opacity = targetOpacity;
        meshRef.current.material.transparent = true;
      }
    }
  });

  if (!texture) {
    return null;
  }

  return (
    <>
      <mesh
        ref={meshRef}
        position={countryPos.position}
        onClick={
          isInForeground
            ? (e) => {
                if (e.ctrlKey || e.metaKey) {
                  onComparisonAction(countryPos.country);
                } else {
                  onClick(countryPos.country);
                }
              }
            : undefined
        }
        onPointerOver={isInForeground ? onHover : undefined}
        onPointerOut={isInForeground ? onUnhover : undefined}
      >
        <planeGeometry args={[1, 0.6]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent
          alphaTest={0.1}
        />
        {/* Bordure pour les pays en comparaison */}
        {isInComparison && (
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry args={[0.45, 0.55, 16]} />
            <meshBasicMaterial
              color="#10b981"
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </mesh>
    </>
  );
});

// Composant Globe invisible
function InvisibleGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[9.5, 32, 16]} />
      <meshBasicMaterial transparent opacity={0.02} color="#4FFFEF" wireframe />
    </mesh>
  );
}

// Composant principal de la scène 3D
function Globe3DScene({
  countries,
  onCountryClick,
  onComparisonAction,
  isCountryInComparison,
  focusedCountry,
  searchResults = [],
}: {
  countries: CountryPosition[];
  onCountryClick: (country: Country) => void;
  onComparisonAction: (country: Country) => void;
  isCountryInComparison: (countryCode: string) => boolean;
  focusedCountry?: CountryPosition | null;
  searchResults?: CountryPosition[];
}) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const { camera } = useThree();
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  // Optimisation: mémoriser les callbacks pour éviter les re-renders
  const handleCountryHover = useCallback((countryCode: string) => {
    setHoveredCountry(countryCode);
  }, []);

  const handleCountryUnhover = useCallback(() => {
    setHoveredCountry(null);
  }, []);

  const handleCountryClick = useCallback(
    (country: Country) => {
      onCountryClick(country);
    },
    [onCountryClick]
  );

  // Optimisation: mémoriser les résultats de recherche comme Set pour les lookups rapides
  const searchResultsSet = useMemo(() => {
    return new Set(searchResults.map((result) => result.country.cca2));
  }, [searchResults]);

  // Debounce le focusedCountry pour éviter les animations trop fréquentes
  const debouncedFocusedCountry = useDebounce(focusedCountry, 300); // 300ms de délai

  useEffect(() => {
    // Position initiale de la caméra - toujours fixe
    camera.position.set(0, 25, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Faire tourner la caméra vers le pays focalisé (avec debounce)
  useEffect(() => {
    if (debouncedFocusedCountry && orbitControlsRef.current) {
      const flagPosition = new THREE.Vector3(
        ...debouncedFocusedCountry.position
      );

      // Positionner la caméra du MÊME côté que le drapeau
      // Ainsi le drapeau sera visible et cliquable du côté de la caméra
      const distance = 30; // Distance fixe de la caméra
      const direction = flagPosition.clone().normalize();
      const newCameraPosition = direction.multiplyScalar(distance); // MÊME direction (pas opposé)

      // Animer la caméra vers la nouvelle position
      const startPosition = camera.position.clone();
      const targetPosition = newCameraPosition;

      let progress = 0;
      const animateCamera = () => {
        progress += 0.05; // Vitesse d'animation
        if (progress >= 1) {
          progress = 1;
        }

        // Interpolation linéaire
        camera.position.lerpVectors(startPosition, targetPosition, progress);
        camera.lookAt(0, 0, 0); // Toujours regarder le centre

        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        }
      };

      animateCamera();
    }
  }, [debouncedFocusedCountry, camera]);

  // Gérer le changement de curseur
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.style.cursor = hoveredCountry ? "pointer" : "";
    }
  }, [hoveredCountry]);

  return (
    <>
      {/* Lumière ambiante */}
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Globe invisible */}
      <InvisibleGlobe />

      {/* Drapeaux */}
      {countries.map((countryPos, index) => {
        const uniqueKey = countryPos.country.cca2 || `country-${index}`;

        return (
          <FlagSprite
            key={uniqueKey}
            countryPos={countryPos}
            onClick={handleCountryClick}
            onComparisonAction={onComparisonAction}
            isHovered={hoveredCountry === uniqueKey}
            onHover={() => handleCountryHover(uniqueKey)}
            onUnhover={handleCountryUnhover}
            focusedCountry={focusedCountry}
            isSearchResult={searchResultsSet.has(countryPos.country.cca2)}
            isInComparison={isCountryInComparison(countryPos.country.cca2)}
          />
        );
      })}

      {/* Contrôles de caméra */}
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={20}
        maxDistance={45}
        autoRotate={false}
        autoRotateSpeed={0.5}
        target={[0, 0, 0]}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: undefined,
        }}
      />
    </>
  );
}

// Interface du composant principal
interface Globe3DProps {
  countries: CountryPosition[];
  onCountryClick: (country: Country) => void;
  onComparisonAction?: (country: Country) => void;
  isCountryInComparison?: (countryCode: string) => boolean;
  className?: string;
  canvasClassName?: string;
  focusedCountry?: CountryPosition | null;
  searchResults?: CountryPosition[];
}

export default function Globe3D({
  countries,
  onCountryClick,
  onComparisonAction = () => {},
  isCountryInComparison = () => false,
  className = "",
  canvasClassName = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  focusedCountry,
  searchResults = [],
}: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Fonction pour appliquer les classes au canvas
    const applyCanvasClasses = () => {
      const canvas = document.querySelector("canvas");
      if (canvas && canvasClassName) {
        canvas.className = canvasClassName;
      }
    };

    // Appliquer immédiatement
    applyCanvasClasses();

    // Observer les changements dans le DOM pour réappliquer si nécessaire
    const observer = new MutationObserver(() => {
      applyCanvasClasses();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [canvasClassName]);

  return (
    <div className={`${className}`}>
      <Canvas camera={{ position: [0, 40, 20], fov: 60 }} ref={canvasRef}>
        <Globe3DScene
          countries={countries}
          onCountryClick={onCountryClick}
          onComparisonAction={onComparisonAction}
          isCountryInComparison={isCountryInComparison}
          focusedCountry={focusedCountry}
          searchResults={searchResults}
        />
      </Canvas>
    </div>
  );
}
