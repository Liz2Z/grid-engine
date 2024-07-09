
import GridEngine from '@lazymonkey/grid-engine';


type GridEngineSettings = typeof  GridEngine.settings;

interface GridEngineRCSettings extends GridEngineSettings {
  /** 触底范围 */  
  TOUCH_BOTTOM_RANGE: number;
  /** 触底之后自动增长的速度 */
  AUTO_INCREASE_SPEED: number;

}

export const settings:GridEngineRCSettings = GridEngine.settings as GridEngineRCSettings;


settings.TOUCH_BOTTOM_RANGE = 3;

settings.AUTO_INCREASE_SPEED = 5;