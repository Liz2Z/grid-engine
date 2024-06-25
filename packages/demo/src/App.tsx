import React from 'react';
import { Canvas, CanvasElement, GridEngine, CanvasBackground } from '@lazymonkey/grid-engine-rc';
import Card from './Card';
import humanId from 'human-id';

import '@lazymonkey/grid-engine-rc/src/index.less';
import "./app.less"

const defaultLayouts = {
  'Big A': { width: 10, height: 10, left: 0, top: 0 },
  'Small B': { width: 10, height: 5, left: 10, top: 0 },
  'Big C': { width: 10, height: 15, left: 10, top: 10 },
};

const getRandom = () => {
  return Math.floor(Math.random() * 12) + 3;
};



export default function App() {
  const modelRef = React.useRef<GridEngine>();
  const [layouts, setLayout] = React.useState<GridEngine.Layouts>(defaultLayouts);

  if (!modelRef.current) {
    modelRef.current = new GridEngine();
    modelRef.current.fromJSON(defaultLayouts);
  }

  const addHandler = () => {
    const id = humanId('~');

    modelRef.current!.add(id, { width: getRandom(), height: getRandom() });
  };

  React.useEffect(() => {
    return modelRef.current!.subscribe(() => {
      const _layouts = modelRef.current!.toJSON();
      setLayout(_layouts);
    });
  }, []);

  const els = React.useMemo(() => Object.entries(layouts), [layouts]);

  return (
    <div>
      <div className="flex justify-between items-center  p-6">
        <h1 className="text-4xl">
          <a href="https://github.com/Liz2Z/grid-engine">Grid Engine</a>
        </h1>
        <div>
          <button
            className="bg-slate-50 hover:bg-slate-200 active:bg-slate-100 p-1 px-2 rounded-sm text-gray-500"
            onClick={addHandler}
          >
            Add +
          </button>
        </div>
      </div>

      <Canvas Background={CanvasBackground} style={{ width: '100%', minHeight: '100vh' }}>
        {els.map(([id, layout]) => (
          <CanvasElement id={id} key={id} layout={layout} onLayoutChange={modelRef.current?.setRect}>
            <Card>{id}</Card>
          </CanvasElement>
        ))}
      </Canvas>
    </div>
  );
}
