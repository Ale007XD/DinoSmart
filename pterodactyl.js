export class Pterodactyl {
  constructor() {
    this.object = new THREE.Group();

    this.material = new THREE.MeshStandardMaterial({ 
      color: 0x8B7765,
      roughness: 0.7,
      metalness: 0.1
    });

    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
    const body = new THREE.Mesh(bodyGeometry, this.material);
    body.rotation.z = Math.PI / 2;
    this.object.add(body);

    const headGeometry = new THREE.ConeGeometry(0.2, 0.8, 8);
    const head = new THREE.Mesh(headGeometry, this.material);
    head.position.set(1.2, 0, 0);
    head.rotation.z = -Math.PI / 2;
    this.object.add(head);

    const crestGeometry = new THREE.ConeGeometry(0.1, 0.4, 4);
    const crest = new THREE.Mesh(crestGeometry, this.material);
    crest.position.set(1.2, 0.3, 0);
    crest.rotation.z = Math.PI;
    this.object.add(crest);

    const wingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B7765, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    const leftWingGeometry = new THREE.PlaneGeometry(2, 0.8);
    const leftWing = new THREE.Mesh(leftWingGeometry, wingMaterial);
    leftWing.position.set(0, 0, -0.7);
    leftWing.rotation.y = Math.PI / 4;
    this.object.add(leftWing);

    const rightWingGeometry = new THREE.PlaneGeometry(2, 0.8);
    const rightWing = new THREE.Mesh(rightWingGeometry, wingMaterial);
    rightWing.position.set(0, 0, 0.7);
    rightWing.rotation.y = -Math.PI / 4;
    this.object.add(rightWing);

    const tailGeometry = new THREE.ConeGeometry(0.1, 0.8, 4);
    const tail = new THREE.Mesh(tailGeometry, this.material);
    tail.position.set(-1.2, 0, 0);
    tail.rotation.z = Math.PI / 2;
    this.object.add(tail);

    this.object.position.set(0, 0, 0);
    this.object.rotation.y = Math.PI / 2;

    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0.15;
    this.gravity = -0.005;
    this.lift = 0.015;
    this.drop = -0.015; // Добавляем силу для движения вниз
    this.boundingRadius = 1.0;
  }

  animateWings(time) {
    const wings = this.object.children.filter(child => 
      child.geometry instanceof THREE.PlaneGeometry);
    
    if (wings.length === 2) {
      const leftWing = wings[0];
      const rightWing = wings[1];
      leftWing.rotation.z = Math.sin(time * 5) * 0.2;
      rightWing.rotation.z = -Math.sin(time * 5) * 0.2;
    }
  }

  update(controls, deltaTime) {
    this.velocity.y += this.gravity * deltaTime * 60;
    
    if (controls.up) {
      this.velocity.y += this.lift * deltaTime * 60;
    }
    if (controls.down) {
      this.velocity.y += this.drop * deltaTime * 60;
    }
    
    if (controls.left) {
      this.velocity.x = -this.speed;
    } else if (controls.right) {
      this.velocity.x = this.speed;
    } else {
      this.velocity.x *= 0.95;
    }
    
    this.velocity.y = Math.max(Math.min(this.velocity.y, 0.2), -0.2);
    
    this.object.position.x += this.velocity.x * deltaTime * 60;
    this.object.position.y += this.velocity.y * deltaTime * 60;
    
    if (this.object.position.y > 10) {
      this.object.position.y = 10;
      this.velocity.y = 0;
    }
    if (this.object.position.y < -10) {
      this.object.position.y = -10;
      this.velocity.y = 0;
    }
    
    this.object.rotation.z = -this.velocity.y * 2;
  }

  checkCollision(rocks) {
    for (const rock of rocks) {
      const distance = this.object.position.distanceTo(rock.object.position);
      if (distance < this.boundingRadius + rock.boundingRadius) {
        return true;
      }
    }
    return false;
  }

  getPosition() {
    return this.object.position;
  }

  reset() {
    this.object.position.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
  }
}
