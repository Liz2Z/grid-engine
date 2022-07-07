import './components/style.less';
import Canvas from './components/Canvas';
import Element from './components/Element';
import createEngine from './engine';
import useIsWorking from './apiHooks/useIsWorking';
import useElementSize from './apiHooks/useElementSize';
import useElementResize from './apiHooks/useElementResize';
import useElementMoveHandler from './apiHooks/useElementMoveHandler';

const LayoutEngine = {
  Canvas,
  Element,
  createEngine,
  useIsWorking,
  useElementSize,
  useElementResize,
  useElementMoveHandler,
};

export default LayoutEngine;
