import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        queueJob: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].queueJob.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { queueJob, handle } = this.queues[job.key];

      queueJob.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FALHA`, err);
  }
}

export default new Queue();
