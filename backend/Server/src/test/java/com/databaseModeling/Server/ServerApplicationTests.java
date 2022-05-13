package com.databaseModeling.Server;

import com.databaseModeling.Server.model.conceptionalModel.ErType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ServerApplicationTests {

	@Test
	void contextLoads() {
		String a = "StrongEntity";
		var b = ErType.valueOf(a);
		Assertions.assertEquals(b, ErType.StrongEntity);
	}

}
