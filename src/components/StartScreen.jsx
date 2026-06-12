import forja_logo from '../assets/forja_match_logo.png'

function StartScreen({ onStart }) {
  return (
    <section className="screen start-screen">
      <header className='title'>
        <img id='forja-logo' src={forja_logo} alt="FORJA Match Logo"/>
      </header>

      <p className="subtitle">
        Descubra qual jogo da FORJA combina mais com você
      </p>

      <p className="instructions">
        Leia as frases e escolha se elas têm ou não a ver com seu jeito de jogar
      </p>

      <button className="primary-button" onClick={onStart}>
        Começar
      </button>
    </section>
  );
}

export default StartScreen;
