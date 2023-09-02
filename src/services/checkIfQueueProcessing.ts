let isQueueProcessing = false;

const setQueueProcessingCheck = (value: boolean) => {
  isQueueProcessing = value;
};

const checkIfQueueProcessing = () => isQueueProcessing;

export { checkIfQueueProcessing, setQueueProcessingCheck }