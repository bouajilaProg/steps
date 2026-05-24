title: PWA image process app
date: 2026-05-24
status: draft

overview:
  - pwa that shows a sequence of images for a process
  - swipe left/right to move through images
  - menu button to select a specific image
  - images cached locally for offline use

current_sprint:
  goal: define the pwa experience and ship a mock-ui with placeholder assets
  scope:
    - swipe navigation between images in a process
    - menu opens image list and jump-to selection
    - offline-first behavior described (no real sync yet)
    - mock data for process + version + images
    - placeholder images bundled with the app
  out_of_scope:
    - real update detection
    - wifi-only update logic
    - admin upload ui
    - api implementation
  deliverables:
    - spec + backlog in this file
    - ui shell with mock images
  acceptance_criteria:
    - swipe left/right updates current image index
    - menu opens and selecting an item jumps to that image
    - app loads with placeholder images offline
    - data model defined for process/version/images

data_model:
  process:
    - id: string
    - title: string
    - version: string
    - images: image[]
  image:
    - id: string
    - title: string
    - order: number
    - uri: string
    - cached_path: string (local)

user_flows:
  - open app -> default process -> first image
  - swipe right/left to navigate
  - tap menu -> list images -> select -> jump
  - offline -> cached images displayed without network

backlog_full_app:
  1_data_model_and_storage:
    - finalize process schema and versioning rules
    - local storage strategy for cached images
    - cache eviction policy
  2_offline_sync_and_updates:
    - wifi-only update checks
    - manifest diff + delta download
    - integrity checks (hash)
    - rollback on failed update
  3_admin_app_apps_admin:
    - process version create/update
    - image upload + ordering
    - publish flow
  4_api_apps_api:
    - list processes + versions
    - manifest endpoint for assets
    - signed asset download urls
  5_pwa_system:
    - service worker caching rules
    - background sync
    - update notification ui
  6_qa_and_monitoring:
    - offline test matrix
    - update failure logging
    - device storage health checks
