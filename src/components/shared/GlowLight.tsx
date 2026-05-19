export const GlowLight = () => {
  return (
    <>
      <ambientLight intensity={0.3} color="#1a1a2e" />
      <pointLight position={[12, 12, 8]} intensity={1.5} color="#00D4FF" />
      <pointLight position={[18, -2, 14]} intensity={1} color="#7B2FFF" />
      <spotLight
        position={[0, 12, 10]}
        angle={0.35}
        penumbra={0.7}
        intensity={1.2}
        color="#00D4FF"
      />
    </>
  );
};
