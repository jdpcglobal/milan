import axios from "axios";
import { BASE_URL } from "./ApiConst";

export const postRequest = async (url: string, data: any, message?: any) => {
    console.log(JSON.stringify(data) + ' data from PostRequest' + url);
    try {
      let res = await axios.request({
        method: 'post',
        url: BASE_URL + url,
        data,
      });
      if (res) {
        if (res?.data?.isSuccess === false) {
        console.warn(
            res?.data?.message || 'Something Went Wrong! Please Try Again')
            
        }
        return res;
      }
    } catch (e: any) {
      console.log('----errror---', e);
    console.warn(
        e?.response?.data?.message || 'Something Went Wrong! Please Try Again', 
      );
    }
  };
  


export const callPostApiWithoutPayload = (url:string, successCallBack:any, failedCallBack:any) => {
    axios.post(url).then((result) => {
        if (successCallBack != null) {
            if(result.status === 200){
                successCallBack(result.data);
            }
        }
    }).catch((error) => {
        if (failedCallBack != null) {
            failedCallBack(error);
        }
    })
}