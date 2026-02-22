import PQueue from 'p-queue'

const concurrency = parseInt(process.env.PDF_CONCURRENCY ?? '2', 10)

export const pdfQueue = new PQueue({ concurrency })
