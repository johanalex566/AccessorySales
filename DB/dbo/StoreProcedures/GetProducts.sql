CREATE PROCEDURE GetProducts
AS BEGIN
	SELECT ProductId AS Id, Code,[Name],[Description],Stock,Value AS ProductValue,CreationDate FROM tblProducts
END