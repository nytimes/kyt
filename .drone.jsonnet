local node_image = "node:14.15.0@sha256:a2397f3a30c8631d761b6e7d13af5a1107b2222b7d0ec2f515640674a44a09fd";

local local_step = {
  pull: "if-not-exists",
  image: node_image,
  when: {
    event: ["push"]
  }
};

[
  {
    kind: "pipeline",
    type: "docker",
    name: "kyt",

    steps: [
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
        name: "test",
        commands: ["yarn e2e"]
      }
    ]
  }
]
