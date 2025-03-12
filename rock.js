export class Rock {
  constructor(position, size) {
    const geometry = new THREE.IcosahedronGeometry(size, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.9,
      metalness: 0.1
    });
    
    this.object = new THREE.Mesh(geometry, material);
    this.object.position.copy(position);
    
    this.object.rotation.x = Math.random() * Math.PI;
    this.object.rotation.y = Math.random() * Math.PI;
    this.object.rotation.z = Math.random() * Math.PI;
    
    if (geometry.attributes.position) {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.2 * size;
        positions[i + 1] += (Math.random() - 0.5) * 0.2 * size;
        positions[i + 2] += (Math.random() - 0.5) * 0.2 * size;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
    
    this.boundingRadius = size * 1.2;
  }

  update(speed, deltaTime) {
    this.object.position.z += speed * deltaTime * 60;
  }

  isOutOfBounds(cameraPosition) {
    return this.object.position.z > cameraPosition.z + 10;
  }
}

export class RockGenerator {
  constructor(scene) {
    this.scene = scene;
    this.rocks = [];
    this.rockSpeed = 0.2;
    this.spawnDistance = -100;
    this.spawnInterval = 1;
    this.spawnTimer = 0;
    this.difficulty = 1;
  }

  createRock() {
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      this.spawnDistance
    );
    
    const size = 1 + Math.random() * 2 * this.difficulty;
    const rock = new Rock(position, size);
    
    this.scene.add(rock.object);
    this.rocks.push(rock);
  }

  update(deltaTime, cameraPosition) {
    this.spawnTimer += deltaTime;
    
    if (this.spawnTimer >= this.spawnInterval) {
      this.createRock();
      this.spawnTimer = 0;
      
      this.spawnInterval = Math.max(0.5, this.spawnInterval - 0.01);
      this.difficulty = Math.min(3, this.difficulty + 0.01);
    }
    
    for (let i = this.rocks.length - 1; i >= 0; i--) {
      const rock = this.rocks[i];
      rock.update(this.rockSpeed, deltaTime);
      
      if (rock.isOutOfBounds(cameraPosition)) {
        this.scene.remove(rock.object);
        this.rocks.splice(i, 1);
      }
    }
  }

  getRocks() {
    return this.rocks;
  }

  reset() {
    for (const rock of this.rocks) {
      this.scene.remove(rock.object);
    }
    this.rocks = [];
    this.spawnTimer = 0;
    this.spawnInterval = 1;
    this.difficulty = 1;
  }
}
