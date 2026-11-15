# NEURAL WILDERNESS — Phase 1 Foundation

## Repository audit

- Repository: https://github.com/omdev009mishra/PranjalMishraProfile
- Default branch: main
- Working branch: feature/neural-wilderness-phase-1
- Current stack: React 19 + Vite 7 + JavaScript + CSS
- Current entry: src/main.jsx -> src/App.jsx -> src/Profile.jsx
- Existing portfolio content is concentrated in a large src/Profile.jsx component.
- Existing assets are stored in src/assets/.
- Existing site already has gamification elements, including achievements, quests, XP, click effects and skill interactions.
- Current project showcase contains SimpleNotes, Dino Game, Email Management System and Funkyman.
- Current skills and experience data are embedded directly in JSX.
- The current README is still the default Vite template.

## Migration strategy

Keep the current main branch untouched. Build on this feature branch.

Preserve the existing Profile.jsx and its assets during the transition. Do not delete the legacy implementation until the new experience has feature parity for the important portfolio information and all external links have been verified.

Adopt React + TypeScript + Vite with React Three Fiber, Three.js, Drei, GSAP/ScrollTrigger and Zustand.

Use two coordinated layers:
1. A persistent 3D world canvas for environment, lighting, camera, vegetation and interactive world objects.
2. Semantic HTML overlays for readable portfolio content, keyboard access, SEO and project details.

## Phase 1 scope

1. Establish TypeScript support without removing the existing JavaScript implementation.
2. Add the 3D and animation dependencies.
3. Define the NEURAL WILDERNESS design tokens:
   - Forest black: #07120F
   - Deep forest: #102D25
   - Emerald: #0B5948
   - Bioluminescent green: #18C6A1
   - Neon cyan: #44D9FF
   - Soft light: #B5F5D2
4. Define five world zones:
   - THE AWAKENING
   - THE LIVING NETWORK
   - THE EXPERIMENTATION ZONE
   - THE TECHNOLOGY CORE
   - THE EXIT PORTAL
5. Define shared world state for scroll progress, active zone and selected interactive object.
6. Establish the 3D canvas boundary and a lightweight placeholder scene.
7. Keep the existing profile available until the new experience is ready.

## Phase 1 acceptance criteria

- Existing portfolio remains available on main.
- Feature branch builds independently.
- TypeScript can coexist with the existing JSX files.
- The new 3D canvas mounts without blocking the HTML UI.
- World zone metadata is data-driven.
- Scroll and active-zone state have a single source of truth.
- No unverified project claims, social links or resume URLs are introduced.
- A reduced-motion and non-WebGL fallback path is planned before cinematic animation is added.

## Next phases

- Phase 2: jungle environment, free licensed assets, custom Blender hero assets, vegetation instancing, fog, lights and particles.
- Phase 3: scroll-driven camera choreography and zone transitions.
- Phase 4: clickable tree, project stations, skill nodes and portal.
- Phase 5: migrate verified portfolio content into data-driven overlays.
- Phase 6: sound design and immersion.
- Phase 7: mobile, accessibility, performance, SEO and deployment validation.

## Asset licensing

Use assets with clearly compatible licences. Record the source URL, author, licence and attribution requirements for every imported model or texture. Prefer CC0 assets where possible. Do not assume that a downloadable model is free for commercial or portfolio use.

## Performance principles

- Load the first scene before distant zones.
- Use GLB/glTF, mesh compression and KTX2 textures where appropriate.
- Instance repeated vegetation.
- Keep post-processing optional and adaptive.
- Provide a mobile quality tier and reduced-motion mode.
- Avoid loading large environment assets on the initial route.
