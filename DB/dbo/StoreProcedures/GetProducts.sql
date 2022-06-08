CREATE PROCEDURE GetProducts
AS BEGIN
	SELECT ProductId, Code,[Name],[Description],Stock,Value,CreationDate FROM tblProducts
END