const PARTICLE_COUNT = 36;

function HeartParticles() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const angle = (360 / PARTICLE_COUNT) * index;
    const delay = (index % 12) * -0.28;
    const duration = 3.4 + (index % 6) * 0.28;
    const size = 0.75 + (index % 5) * 0.18;
    const distance = 780 + (index % 6) * 90;

    return {
      id: index,
      angle,
      delay,
      duration,
      size,
      distance,
    };
  });

  return (
    <div className="heart-particles" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="heart-particle"
          style={{
            "--angle": `${particle.angle}deg`,
            "--delay": `${particle.delay}s`,
            "--duration": `${particle.duration}s`,
            "--size": `${particle.size}rem`,
            "--distance": `${particle.distance}px`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}

export default HeartParticles;
