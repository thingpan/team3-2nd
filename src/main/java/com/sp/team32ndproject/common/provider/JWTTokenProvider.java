package com.sp.team32ndproject.common.provider;

import java.security.Key;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.sp.team32ndproject.user.service.UserInfoService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JWTTokenProvider {
	private final UserInfoService userDetailsService;
	private final String tokenSecret = "adfasdfsadfasdfsa2131saf";

	private final int tokenExpire = 1000 * 3600;
	private final int refreshTokenExpire = 1000 * 3600;
	
	public int getTokenExpire() {
		return tokenExpire;
	}

	private Date getJwtExpiretime(int tokenExpire) {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MILLISECOND, tokenExpire);
		return c.getTime();
	}
	
	private Key getKey() {
		byte[] bytes = DatatypeConverter.parseBase64Binary(tokenSecret);
		return new SecretKeySpec(bytes, SignatureAlgorithm.HS256.getJcaName());
	}
	
	private String getJwt(Map<String,Object> claims, Date now, Date expireDate) {
		return Jwts.builder()
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(expireDate)
				.signWith(SignatureAlgorithm.HS256, getKey())
				.compact();
	}
	
	public String generateToken(Authentication authentication) {
		Claims claims = Jwts
				.claims().setSubject(authentication.getName());
		return getJwt(claims,Calendar.getInstance().getTime(), getJwtExpiretime(tokenExpire));
	}

	public String generateRefreshToken(Authentication authentication) {
		Claims claims = Jwts.claims().setSubject(authentication.getName());
		String refreshToken = getJwt(claims,Calendar.getInstance().getTime(), getJwtExpiretime(refreshTokenExpire));
		return refreshToken;
	}

	public Authentication getAuthentication(String token) {
		String uiId = Jwts
				.parser()
				.setSigningKey(tokenSecret)
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
		
		UserDetails userDetails = userDetailsService.loadUserByUsername(uiId);
		return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
	}

	public String resolveToken(HttpServletRequest req) {
		String token = req.getHeader("Authorization");
		if (token != null && token.startsWith("Bearer ")) {
			return token.substring(7);
		}
		return null;
	}

	public boolean validation(String token) {
		Jwts.parser().setSigningKey(tokenSecret).parseClaimsJws(token);
		return true;
	}

	public String getId(String token) {
		Claims claims = Jwts.parser().setSigningKey(getKey()).parseClaimsJws(token).getBody();
		return claims.getSubject();
	}
}
