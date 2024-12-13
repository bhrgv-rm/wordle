const Keyb = () => {
  const KEYBOARD = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  return (
    <div>
      {KEYBOARD.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.split("").map((key, keyIndex) => (
            <button key={keyIndex}>{key}</button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyb;
