function DededeSpawnInhaleParticle() {
   if (!dedede.isInhaling)
      return;

   var random;

   // Creation
   var particle = SpawnObject("particleDedede");

   // Position
   // X
   if (dedede.isFlip)
      particle.style.left = (dedede.transform.left + dedede.transform.width / 2 + 60 * Math.round(SCALE)) + "px";
   else
      particle.style.left = (dedede.transform.left + dedede.transform.width / 2 - 60 * Math.round(SCALE)) + "px";
   // Y
   random = GetRandomInt(dedede.transform.top, dedede.transform.top + dedede.transform.height);
   particle.style.top = random + "px";

   // Insertion
   dedede.element.parentNode.insertBefore(particle, dedede.element);

   // Scaling
   RescaleObject(particle);

   // Movement
   setInterval(MoveParticleTowardsDededeLeft, PARTICLE_SPEED, particle);
   setInterval(MoveParticleTowardsDededeTop, PARTICLE_SPEED * 3, particle)
}


function MoveParticleTowardsDededeLeft(particle) {
   var particle_left = ParseInt(particle, "left");

   // X
   if (particle_left < dedede.transform.left + dedede.transform.width / 2)
      particle.style.left = (particle_left + Math.round(SCALE)) + "px";
   else if (particle_left > dedede.transform.left + dedede.transform.width / 2)
      particle.style.left = (particle_left - Math.round(SCALE)) + "px";
   else
      particle.remove();
}

function MoveParticleTowardsDededeTop(particle) {
   var particle_top = ParseInt(particle, "top");

   // Y
   if (particle_top < dedede.transform.top + dedede.transform.height / 2) {
      particle.style.top = (particle_top + Math.round(SCALE)) + "px";
   }
   else if (particle_top > dedede.transform.top + dedede.transform.height / 2) {
      particle.style.top = (particle_top - Math.round(SCALE)) + "px";
   }
}

function DededeDeleteAllInhaleParticle() {
   var particles = document.getElementsByClassName("particleDedede");

   for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].remove();
   }
}