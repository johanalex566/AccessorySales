CREATE PROCEDURE SaveProducts(@jsonProduct VARCHAR(3000))
AS BEGIN

	SELECT
    [Name], Code ,[Description] ,Stock, [Value]
	INTO #tempProduct
    FROM OPENJSON(@jsonProduct)
    WITH (
     [Name]			VARCHAR(100) '$.Name'
    ,Code			VARCHAR(100) '$.Code'
    ,[Description]  VARCHAR(100) '$.Description'
    ,Stock			INT          '$.Stock'
	,[Value]        DECIMAL      '$.Value' ) AS jsonValues

	MERGE tblProducts AS TGT  
    USING 
	(SELECT [Name], Code ,[Description] ,Stock, [Value] FROM #tempProduct)
	AS SRC ([Name], Code ,[Description] ,Stock, [Value])
    ON (TGT.Code = SRC.Code)  
    WHEN MATCHED THEN
        UPDATE 
			SET Name = SRC.Name,
			 Code = SRC.Code,
			 [Description] = SRC.[Description],
			 Stock = SRC.Stock,
			 [Value] = SRC.[Value]
    WHEN NOT MATCHED THEN  
        INSERT ([Name], Code ,[Description] ,Stock, [Value])  
        VALUES (SRC.Name, SRC.Code, SRC.Description, SRC.Stock, SRC.Value);

	DROP TABLE IF EXISTS #tempProduct	

END
