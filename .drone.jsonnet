local node_image = "node:14.15.5";

local local_step = {
  pull: "if-not-exists",
  image: node_image,
};

local steps = [
  local_step + {
    name: "bootstrap",
    commands: ["yarn bootstrap"]
  },
  local_step + {
    name: "lint",
    commands: ["yarn lint:ci"]
  },
  local_step + {
    name: "test",
    commands: ["yarn test:ci"]
  },
  local_step + {
    name: "e2e",
    commands: ["yarn e2e"]
  }
];

[
  {
    kind: "pipeline",
    type: "docker",
    name: "kyt_pr",
    trigger: {
      event: ["pull_request"]
    },

    steps: steps,
  },
  {
    kind: "pipeline",
    type: "docker",
    name: "kyt_main_push",
    trigger: {
      branch: ["main"],
      event: ["push"]
    },

    steps: steps,
  }
]
