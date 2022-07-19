function sayHello() {
  console.log('hello client');
}

function Dynamic() {
  return (
    <div>
      <h2>Dynamic Content</h2>
      <button type="button" onClick={sayHello}>
        Say Hello
      </button>
    </div>
  );
}

export default Dynamic;
