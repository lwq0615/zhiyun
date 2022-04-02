package com.manager.demo.tool;

import io.jsonwebtoken.*;

import java.util.*;

public class Jwt {

    private static long time = 1000*60*60*24;

    private static String signature = "admin";


    public static String getToken(Map map){
        JwtBuilder jwtBuilder = Jwts.builder();
        return jwtBuilder
                .setHeaderParam("typ","JWT")
                .setHeaderParam("alg","HS256")
                .setClaims(map)
                .setExpiration(new Date(System.currentTimeMillis() + time))
                .setId(UUID.randomUUID().toString())
                .signWith(SignatureAlgorithm.HS256,signature)
                .compact();
    }

    public static Map parse(String token){
        Map map = new HashMap();
        JwtParser jwtParser = Jwts.parser();
        Jws<Claims> claimsJws = jwtParser.setSigningKey(signature).parseClaimsJws(token);
        Claims claims = claimsJws.getBody();
        map.put("userId",claims.get("userId"));
        map.put("role",claims.get("role"));
        map.put("id",claims.get("id"));
        map.put("power",claims.get("power"));
        return map;
    }

}
