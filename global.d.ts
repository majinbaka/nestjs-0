// global.d.ts
declare global {
  namespace NodeJS {
    interface Global {
      dataSource: import('typeorm').DataSource;
    }
  }
}
