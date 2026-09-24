import Phaser from "https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.esm.js";

const WORLD = Object.freeze({
  width: 3200,
  height: 2200,
  padding: 32,
});

const COLORS = Object.freeze({
  background: 0x0b0e12,
  ground: 0x11161b,
  road: 0x1b2026,
  roadAlt: 0x20262d,
  building: 0x20262d,
  buildingStroke: 0x343b44,
  text: "#ece8e1",
  muted: "#9298a1",
  accent: 0xd9a441,
});

class CityScene extends Phaser.Scene {
  constructor() {
    super("CityScene");
    this.draggingCamera = false;
    this.cameraFollowing = true;
    this.pointerStart = null;
    this.cameraStart = null;
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.drawWorld();

    this.player = this.add
      .circle(WORLD.width / 2, WORLD.height / 2, 20, COLORS.accent)
      .setDepth(20);

    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameraFollowing = true;

    this.createHud();
    this.createInput();
    this.createCameraControls();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  createHud() {
    this.title = this.add
      .text(20, 18, "عصابات الشوارع — Phaser", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: COLORS.text,
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.status = this.add
      .text(20, 48, "تحرك لاستكشاف المدينة", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
        color: COLORS.muted,
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.help = this.add
      .text(20, 72, "WASD / الأسهم للحركة • اسحب الشاشة لتحريك الكاميرا", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "12px",
        color: COLORS.muted,
      })
      .setScrollFactor(0)
      .setDepth(100);
  }

  createInput() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.addPointer(2);
  }

  createCameraControls() {
    this.input.on("pointerdown", this.onPointerDown, this);
    this.input.on("pointermove", this.onPointerMove, this);
    this.input.on("pointerup", this.onPointerUp, this);
    this.input.on("pointerupoutside", this.onPointerUp, this);
  }

  onPointerDown(pointer) {
    this.draggingCamera = true;
    this.pointerStart = { x: pointer.x, y: pointer.y };
    this.cameraStart = {
      x: this.cameras.main.scrollX,
      y: this.cameras.main.scrollY,
    };

    if (this.cameraFollowing) {
      this.cameras.main.stopFollow();
      this.cameraFollowing = false;
    }
  }

  onPointerMove(pointer) {
    if (!this.draggingCamera || !pointer.isDown || !this.pointerStart) return;

    const dx = pointer.x - this.pointerStart.x;
    const dy = pointer.y - this.pointerStart.y;

    this.setCameraScroll(
      this.cameraStart.x - dx,
      this.cameraStart.y - dy
    );
  }

  onPointerUp() {
    this.draggingCamera = false;
    this.pointerStart = null;
    this.cameraStart = null;
  }

  setCameraScroll(x, y) {
    const camera = this.cameras.main;
    const maxX = Math.max(0, WORLD.width - camera.width / camera.zoom);
    const maxY = Math.max(0, WORLD.height - camera.height / camera.zoom);

    camera.scrollX = Phaser.Math.Clamp(x, 0, maxX);
    camera.scrollY = Phaser.Math.Clamp(y, 0, maxY);
  }

  followPlayer() {
    if (this.cameraFollowing) return;
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameraFollowing = true;
  }

  drawWorld() {
    const g = this.add.graphics();

    g.fillStyle(COLORS.ground, 1);
    g.fillRect(0, 0, WORLD.width, WORLD.height);

    for (let x = 80; x < WORLD.width; x += 320) {
      g.fillStyle(COLORS.road, 1);
      g.fillRect(x, 0, 72, WORLD.height);
    }

    for (let y = 80; y < WORLD.height; y += 320) {
      g.fillStyle(COLORS.road, 1);
      g.fillRect(0, y, WORLD.width, 72);
    }

    for (let x = 0; x < WORLD.width; x += 160) {
      for (let y = 0; y < WORLD.height; y += 160) {
        if ((x / 160 + y / 160) % 2 === 0) {
          g.fillStyle(COLORS.roadAlt, 0.35);
          g.fillRect(x + 8, y + 8, 144, 144);
        }
      }
    }

    const places = [
      [700, 500, "المقر", 0xd9a441],
      [2500, 520, "السوق", 0x4fa8a0],
      [700, 1700, "التدريب", 0x9b78d0],
      [2500, 1700, "المطار", 0x6c9bd2],
      [1600, 1100, "الحلبة", 0xc96b61],
    ];

    places.forEach(([x, y, name, color]) => {
      const building = this.add
        .rectangle(x, y, 150, 96, COLORS.building)
        .setStrokeStyle(2, COLORS.buildingStroke)
        .setDepth(5);

      this.add
        .circle(x, y - 8, 28, color)
        .setStrokeStyle(3, 0x0d1014)
        .setDepth(6);

      this.add
        .text(x, y + 38, name, {
          fontFamily: "system-ui, sans-serif",
          fontSize: "17px",
          fontStyle: "bold",
          color: COLORS.text,
        })
        .setOrigin(0.5)
        .setDepth(7);

      building.setInteractive({ useHandCursor: true });
      building.on("pointerdown", () => {
        this.status.setText("الموقع المحدد: " + name);
      });
    });
  }

  isMoving() {
    return (
      this.keys.left.isDown ||
      this.keys.right.isDown ||
      this.keys.up.isDown ||
      this.keys.down.isDown ||
      this.cursors.left.isDown ||
      this.cursors.right.isDown ||
      this.cursors.up.isDown ||
      this.cursors.down.isDown
    );
  }

  update(_time, delta) {
    const dx =
      (this.keys.right.isDown || this.cursors.right.isDown ? 1 : 0) -
      (this.keys.left.isDown || this.cursors.left.isDown ? 1 : 0);

    const dy =
      (this.keys.down.isDown || this.cursors.down.isDown ? 1 : 0) -
      (this.keys.up.isDown || this.cursors.up.isDown ? 1 : 0);

    if (!dx && !dy) return;

    const direction = new Phaser.Math.Vector2(dx, dy).normalize();
    const distance = 260 * (delta / 1000);

    this.player.x = Phaser.Math.Clamp(
      this.player.x + direction.x * distance,
      WORLD.padding,
      WORLD.width - WORLD.padding
    );

    this.player.y = Phaser.Math.Clamp(
      this.player.y + direction.y * distance,
      WORLD.padding,
      WORLD.height - WORLD.padding
    );

    // Keyboard movement always returns the camera to the player.
    if (!this.draggingCamera) this.followPlayer();
  }

  cleanup() {
    this.input.off("pointerdown", this.onPointerDown, this);
    this.input.off("pointermove", this.onPointerMove, this);
    this.input.off("pointerup", this.onPointerUp, this);
    this.input.off("pointerupoutside", this.onPointerUp, this);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0b0e12",
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [CityScene],
  render: {
    antialias: true,
    pixelArt: false,
  },
};

new Phaser.Game(config);
