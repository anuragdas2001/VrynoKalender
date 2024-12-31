// import { toast } from "react-toastify";

// //This function won't run as query is required under component function. But the logic is correct for recursive fetch.
// //Modify accordingly (comment this code instead of deleting it entirely if possibly)

export const allDataFetch = async (
  variables: any,
  pageNo: number,
  collectedData: any[]
): Promise<any[]> => {
  //   async function dataFetch(variables: any) {
  //     let data: any;
  //     data = await getCrmData(variables).then((result) => {
  //       if (result?.data?.fetch?.data) {
  //         return result?.data?.fetch?.data;
  //       } else {
  //         toast.error(result?.data?.fetch?.messageKey);
  //       }
  //     });
  //     if (data) {
  //       collectedData = [...collectedData, ...data];
  //     }
  //     return data;
  //   }
  //   async function recursiveFetch(variables: any, pageNo: number) {
  //     const data = await dataFetch({
  //       variables: { ...variables, pageNumber: pageNo },
  //     });
  //     if (data?.length) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   const callAgain = await recursiveFetch(variables, pageNo);
  //   if (!callAgain) {
  //     return collectedData;
  //   }
  return [...(await allDataFetch(variables, ++pageNo, collectedData))];
};
