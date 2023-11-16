package com.sp.team32ndproject.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;

import com.sp.team32ndproject.user.service.UserInfoService;


@Configuration
public class SecurityBeanConfig {
	@Autowired
	private UserInfoService userInfoService;
	
	@Bean
	WebSecurityCustomizer webSecurityCustomizer() { //static 안에 있는 css등등 필요한 애들은 webServer딴에서 이그노어 해줘야 해서 일케 함
		return web -> {
			web.ignoring()	
			.antMatchers("/css/**","/js/**","/imgs/**","/resources/**", "/html/**");
		};
	}
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity hs) throws Exception {
		
		hs.authorizeRequests(req->req
				.antMatchers("/login","/join","/html/login","/html/join", "/html/map", "/html/calendar")
				.permitAll()
				.antMatchers("html/admin/**").hasRole("ADMIN")
				.antMatchers("html/user/**").hasRole("USER")
				.anyRequest().authenticated())
		.formLogin(formLogin -> formLogin
				.loginPage("/html/login")
				.usernameParameter("uiId") 
				.passwordParameter("uiPwd")
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/")
				.failureUrl("/html/login-fail"))
		.logout(logout -> logout
				.logoutUrl("/logout")
				.logoutSuccessUrl("/html/login"))
		.csrf(csfr -> csfr.disable())
		.exceptionHandling(handling -> handling.accessDeniedPage("/html/denied"))
		.userDetailsService(userInfoService);
	
		return hs.build();
	}
}
