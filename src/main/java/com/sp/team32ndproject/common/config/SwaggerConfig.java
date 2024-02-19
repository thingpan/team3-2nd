package com.sp.team32ndproject.common.config;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

public class SwaggerConfig {

	@Bean
	Docket api() {
		return new Docket(DocumentationType.SWAGGER_2)
				.ignoredParameterTypes(AuthenticationPrincipal.class)
				.ignoredParameterTypes(Pageable.class)
				.useDefaultResponseMessages(false)
				.apiInfo(apiInfo())
				.select()
				.apis(RequestHandlerSelectors.basePackage("com.sp.team32ndproject"))
				.paths(PathSelectors.any())
				.build();
	}
	
	public ApiInfo apiInfo() {
		return new ApiInfoBuilder()
				.title("DevelopSpace Rest API Documetation")
				.description("Develop Spave API 명세")
				.version("0.1")
				.build();
	}
}
