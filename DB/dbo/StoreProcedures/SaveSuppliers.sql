CREATE PROCEDURE SaveSuppliers(@json VARCHAR(3000))
AS BEGIN
	
	SELECT
	[Name], [Adress] ,[Phone] ,Email
	INTO #tempSupplier
    FROM OPENJSON(@json)
    WITH (
     [Name]			VARCHAR(100) '$.Name'
    ,[Adress]		VARCHAR(100) '$.Adress'
    ,[Phone]		VARCHAR(100) '$.Phone'
    ,Email			VARCHAR(100) '$.Email' 
	) AS jsonValues

	MERGE tblSuppliers AS TGT  
    USING 
	(SELECT [Name], [Adress] ,[Phone] ,Email FROM #tempSupplier)
	AS SRC ([Name], [Adress] ,[Phone] ,Email)
    ON (TGT.Name = SRC.Name)  
    WHEN MATCHED THEN
        UPDATE 
			SET
			 Name = SRC.Name,
			 Adress = SRC.Adress,
			 [PhoneNumber] = SRC.Phone,
			 Email = SRC.Email
    WHEN NOT MATCHED THEN  
        INSERT ([Name], [Adress] ,[PhoneNumber] ,Email)  
        VALUES (SRC.[Name], SRC.[Adress] ,SRC.[Phone] ,SRC.Email);

	DROP TABLE IF EXISTS #tempSupplier	

END


