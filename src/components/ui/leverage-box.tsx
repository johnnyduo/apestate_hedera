import React, { useState } from 'react';

export default function LeverageBox() {
  const [value, setValue] = useState('1x');

  const leverage = ['1x', '15x', '30x', '45x', '60x', '75x'];

  return (
    <div className="flex">
      {leverage.map((x) => (
        <div
          className={`mr-2 rounded border border-gray-700 p-2 px-3 hover:cursor-pointer ${
            value == x ? 'bg-brand' : ''
          }`}
          onClick={() => setValue(x)}
          key={x}
        >
          {x}
        </div>
      ))}
    </div>
  );
}
