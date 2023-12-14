package com.sp.team32ndproject.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;

import com.sp.team32ndproject.common.checker.TeamParamAuthManager;
import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.user.service.UserInfoService;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class SecurityBeanConfig {
	@Autowired
	private UserInfoService userInfoService;
	@Autowired
	private TeamInfoService teamInfoService;

	@Bean
	WebSecurityCustomizer webSecurityCustomizer() { // static 안에 있는 css등등 필요한 애들은 webServer딴에서 이그노어 해줘야 해서 일케 함
		return web -> {
			web.ignoring().antMatchers("/css/**", "/js/**", "/imgs/**", "/resources/**" );
		};
	}

	//@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity hs) throws Exception {
		hs.authorizeRequests(req->req
			.antMatchers("/login","/join","/page/user/login","/page/user/join")
				.permitAll()
				.anyRequest().authenticated())
		.formLogin(formLogin -> formLogin
				.loginPage("/page/user/login")
				.usernameParameter("uiId")  
				.passwordParameter("uiPwd")
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/")
				.failureUrl("/page/user/login"))
		.logout(logout -> logout
				.logoutUrl("/logout")
				.logoutSuccessUrl("/page/user/login"))
		.csrf(csfr -> csfr.disable())
		.exceptionHandling(handling -> handling.accessDeniedPage("/html/denied"))
		.userDetailsService(userInfoService);
	
		return hs.build();
	}
	
	@Bean
	SecurityFilterChain securityTeamPageFilterChain(HttpSecurity hs) throws Exception {
		hs.authorizeHttpRequests((auth)-> auth
				.antMatchers("/login","/join","/page/user/login","/page/user/join")
				.permitAll()
				.antMatchers("/page/team/team-settings","/page/team/team-apply", "/page/match/match-status")
				.access(new TeamParamAuthManager(teamInfoService))
				.anyRequest()
				.authenticated())
		.formLogin(formLogin -> formLogin
				.loginPage("/page/user/login")
				.usernameParameter("uiId")  
				.passwordParameter("uiPwd")
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/")
				.failureUrl("/page/user/login"))
		.logout(logout -> logout
				.logoutUrl("/logout")
				.logoutSuccessUrl("/page/user/login"));
		
		hs.csrf(csrf -> csrf.disable())
		.exceptionHandling(handling -> handling.accessDeniedPage("/page/denied"))
		.userDetailsService(userInfoService);
		return hs.build();
	}
}
