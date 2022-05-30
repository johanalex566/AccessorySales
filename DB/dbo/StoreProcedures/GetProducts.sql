CREATE PROCEDURE GetProducts
AS BEGIN
	SELECT Code,[Name],[Description],Stock,Value,CreationDate FROM tblProducts
END