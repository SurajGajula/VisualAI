declare global {
  interface Window {
    pdfjsLib: {
      getDocument: (params: { data: Uint8Array }) => {
        promise: Promise<{
          numPages: number;
          getPage: (pageIndex: number) => Promise<{
            getTextContent: () => Promise<{
              items: Array<{ str: string }>;
            }>;
          }>;
        }>;
      };
      GlobalWorkerOptions: {
        workerSrc: string;
      };
    };
  }
}

export {}; 