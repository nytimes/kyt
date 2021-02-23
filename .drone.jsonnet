local node_image = "node:14.15.0@sha256:a2397f3a30c8631d761b6e7d13af5a1107b2222b7d0ec2f515640674a44a09fd";

local local_step = {
  pull: "if-not-exists",
  image: node_image,
};

local steps = [
  local_step + {
    name: "boostrap",
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
    name: "kyt_master_push",
    trigger: {
      branch: ["master"],
      event: ["push"]
    },

    steps: steps,
  }
]
