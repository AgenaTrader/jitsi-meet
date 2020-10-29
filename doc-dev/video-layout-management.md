Video Layout Management
=======================

A `VideoLayout` global object is defined in `modules/UI/videolayout/VideoLayout.js`.

It's a primary layout manager, but it is mostly focused on providing and controlling individual video tiles,
like `RemoteVideo`, `SmallVideo`, `LocalVideo`.

A `react/features/video-layout/middleware` listens to `PARTICIPANT_JOINED` events
and adds new remote participant containers using `VideoLayout.addRemoteParticipantContainer`.

This might be a good place if you want to avoid adding any container at all,
e.g. when you have something like a Webinar Mode and listeners should not really see each other on the scene.

The `RemoteVideo`/`SmallVideo` can also decide on its own if it should render or not.


Filmstrip
---------

See `react/features/filmstrip`.


Tile View
---------

See `react/features/video-layout`. Interacts with `SmallVideo`.

