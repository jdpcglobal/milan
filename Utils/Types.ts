export type RootStackParamList = {
    HomeScreen: undefined;
    DetailOfPlans: undefined;
    Profile: { userId: string };
    Feed: { sort: 'latest' | 'top' } | undefined;
    LoginPage : undefined
    OtpPage : {phoneNumber : string, otpS: number, countryCode: number}
    LocationPage : undefined
    RegisterPage : {phoneNumber : string}
    UserChatScreen : {id:number, name:string}
    AboutProfile : {id:number}
    ProfileScreen: {id:number}
    MainProfile: {id:number}
    NotificationScreen: {id:number}
    Plans: {id:number}
    PlansBuy: {id:number}
    PaymentSuccess: {id:number}
    PaymentError: {id:number}
    UserLikesScreen: {id:number}
    ChatUsers: {id:number}
  };
  
  export interface LoginState {
        logins: {
            auth_token: string;
        };
    };

    export type UserProfile = {
        id: number;
        name: string;
        //email: string;
        age: number;
        gender: string;
        job: string;
        religion: string;
        surname: string;
        mobile: string;
        distanceaway: string;
        images: {id:number, url:string}[];
      };

      export type LikeUsers = {
        id : number,
        name : string,
        age : number,
        surname : string,
        imageUrl : string,
        religion : string,
      }
      export type userImage = {
        id:number|null
        url:string|null
      }
