import React from 'react';
import { Canvas, Element, GridEngine } from '@lazymonkey/grid-engine-rc';
import Card from './Card';
import humanId from 'human-id';

const defaultLayouts = {
  大A: { width: 10, height: 10, left: 0, top: 0 },
  大B: { width: 10, height: 5, left: 10, top: 0 },
  小c: { width: 10, height: 15, left: 10, top: 10 },
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
        <h1 className="text-4xl">Grid</h1>
        <div>
          <button
            className="bg-slate-50 hover:bg-slate-200 active:bg-slate-100 p-1 px-2 rounded-sm text-gray-500"
            onClick={addHandler}
          >
            Add +
          </button>
        </div>
      </div>

      <Canvas bg style={{ width: '100%', minHeight: '100vh' }}>
        {els.map(([id, layout]) => (
          <Element id={id} key={id} layout={layout} onLayoutChange={modelRef.current?.setRect}>
            <Card>{id}</Card>
          </Element>
        ))}
      </Canvas>
    </div>
  );
}
