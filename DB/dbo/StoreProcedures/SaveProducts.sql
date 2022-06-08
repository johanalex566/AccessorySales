CREATE PROCEDURE SaveProducts(@json VARCHAR(3000))
AS BEGIN

	SELECT
    [Name], Code ,[Description] ,Stock, [Value],SupplierId
	INTO #tempProduct
    FROM OPENJSON(@json)
    WITH (
     [Name]			VARCHAR(100) '$.Name'
    ,Code			VARCHAR(100) '$.Code'
    ,[Description]  VARCHAR(100) '$.Description'
    ,Stock			INT          '$.Stock'
	,Stock			INT          '$.Stock'
	,[Value]			DECIMAL  '$.Value'
	,SupplierId     INT         '$.SupplierId' ) AS jsonValues

	MERGE tblProducts AS TGT  
    USING 
	(SELECT [Name], Code ,[Description] ,Stock, [Value],SupplierId FROM #tempProduct)
	AS SRC ([Name], Code ,[Description] ,Stock, [Value],SupplierId)
    ON (TGT.Code = SRC.Code)  
    WHEN MATCHED THEN
        UPDATE 
			SET Name = SRC.Name,
			 Code = SRC.Code,
			 [Description] = SRC.[Description],
			 Stock = SRC.Stock,
			 [Value] = SRC.[Value]
    WHEN NOT MATCHED THEN  
        INSERT ([Name], Code ,[Description] ,Stock, [Value],SupplierId)  
        VALUES (SRC.Name, SRC.Code, SRC.Description, SRC.Stock, SRC.Value,SRC.SupplierId);

	DROP TABLE IF EXISTS #tempProduct	

END
