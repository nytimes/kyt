class ConfigOverrides {
  setFix(fix) {
    this.fix = fix;
  }

  getFix() {
    return this.fix;
  }
}

const configOverrides = new ConfigOverrides();

module.exports = configOverrides;
