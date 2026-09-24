import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.esm.js";
import {BootScene} from "./scenes/BootScene.js";
import {PreloadScene} from "./scenes/PreloadScene.js";
import {MainMenuScene} from "./scenes/MainMenuScene.js";
import {CityScene} from "./scenes/CityScene.js";
import {MissionScene} from "./scenes/MissionScene.js";
import {BattleScene} from "./scenes/BattleScene.js";
import {TrainingScene} from "./scenes/TrainingScene.js";
import {EquipmentScene} from "./scenes/EquipmentScene.js";

const config={
 type:Phaser.AUTO,
 parent:"game",
 backgroundColor:"#0b0e12",
 width:1280,
 height:720,
 scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},
 scene:[BootScene,PreloadScene,MainMenuScene,CityScene,MissionScene,BattleScene,TrainingScene,EquipmentScene],
 render:{antialias:true,pixelArt:false}
};
new Phaser.Game(config);