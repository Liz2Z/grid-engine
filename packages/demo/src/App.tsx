import React from 'react';
import GridEngine from '@lazymonkey/grid-engine-rc';
import Card from './Card';

const defaultLayouts = {
  a: { width: 10, height: 10, left: 0, top: 0 },
  b: { width: 10, height: 5, left: 10, top: 0 },
  c: { width: 10, height: 15, left: 10, top: 10 },
};

export default function App() {
  const modelRef = React.useRef<any>();
  const [layouts, setLayout] = React.useState<any>(defaultLayouts);
  const [cards, setCards] = React.useState<string[]>(() => Object.keys(defaultLayouts));

  if (!modelRef.current) {
    modelRef.current = GridEngine.createEngine();
    modelRef.current.reset(defaultLayouts);
  }

  // console.log(layouts);

  React.useEffect(() => {
    return modelRef.current.subscribe(() => {
      const _layouts = modelRef.current.toJSON();
      setLayout(_layouts);
    });
  }, []);

  return (
    <div>
      <h1>Grid</h1>
      <GridEngine.Canvas bgVisible style={{ width: '100%', minHeight: '100vh' }}>
        {cards.map(card => (
          <GridEngine.Element id={card} key={card} layout={layouts[card]} onLayoutChange={modelRef.current.setLayout}>
            <Card />
          </GridEngine.Element>
        ))}
      </GridEngine.Canvas>
    </div>
  );
}
