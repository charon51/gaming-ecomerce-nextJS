import { getToken, hashExpiredToken } from "api/token";

export async function authFetch(url, params, logout){
    const token = getToken();
    if(!token){
        // usuario no logueado
        logout();
    }else{
        if(hashExpiredToken(token)){
            // token caducado
            logout();
        }else{
            const paramsTemp = {
                ...params,
                headers: {
                    ...params?.headers,
                    Authorization: `Bearer ${token}`,
                    },
                };
                console.log(paramsTemp);
            try {
                const response = await fetch(url, paramsTemp);
                const result = await response.json();
                return result;
            } catch (error) {
                return error;
            }
        }
    }
}