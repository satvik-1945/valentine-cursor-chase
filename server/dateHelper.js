export function getValentineIndex(){
    const today = new Date();
     if(today.getMonth()!==1)return null;

     const day = today.getDate();
     const start = 7;
     const end = 14;
     if(today.getMonth()!==1 || day<start || day>end)return 0;

     return day - start;
}