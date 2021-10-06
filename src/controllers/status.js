module.exports = class Status {
  constructor(isCompleted = false, noOfFails = 0, noOfSuccess = 0) {
    this.isCompleted = isCompleted;
    this.noOfFails = noOfFails;
    this.noOfSuccess = noOfSuccess;
  }

  getStatus() {
    return {
      isCompleted: this.isCompleted,
      noOfFails: this.noOfFails,
      noOfSuccess: this.noOfSuccess,
    };
  }

  updateStatus(isCompleted, noOfFails, noOfSuccess) {
    this.isCompleted = isCompleted;
    this.noOfFails += noOfFails;
    this.noOfSuccess += noOfSuccess;
  }
};
