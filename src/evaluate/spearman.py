# -*- coding: utf-8 -*-
import matplotlib.pyplot as plt
from scipy import stats

level = [2,2,1,1,1,2,2,2,1,2,1,2,2,2,1,2,2,2,1,2,1,2,2,1,1,2,1,3,2,2,2,2,2,1,2,1,1,1,2,3,1,2,2,2,2,1,1,2,3,2,3,1,1,1,2,1,1,2,2,3,1,2,1,2,2,1,1,2,2,1,3,1,2,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,2,2,2,3,3,3,3,3,3]
chScore = [0.5247451318773744,0.6325279535014523,0.5301263498464086,0.3250560643016076,0.4418893734487528,0.6553413671286409,0.5352646317119928,0.5003697264549156,0.4612933886746089,0.5247451318773744,0.5493878739894684,0.6325279535014523,0.5301263498464086,0.5764244635515651,0.5352646317119928,0.4612933886746089,0.4612933886746089,0.5448803866865813,0.4700778529755044,0.451919438758565,0.605319786293578,0.55786704598957,0.5301263498464086,0.4519194387585651,0.5890883825974687,0.3624953128552122,0.5301263498464086,0.6360024070392782,0.5618613225042097,0.6028115339245226,0.37866506544038814,0.5003697264549156,0.5829676085757537,0.4519194387585651,0.5448803866865813,0.55786704598957,0.6168684826816639,0.6250789499255119,0.5948299542831873,0.637682464292838,0.6077577931840943,0.4783305316317984,0.5247451318773744,0.5493878739894684,0.41953831626919,0.55786704598957,0.2786524795555183,0.4783305316317984,0.6325279535014523,0.5401773958281779,0.6002296203887552,0.48610165763024926,0.4418893734487528,0.3031769332204365,0.5618613225042097,0.49343517980358187,0.43112580942128054,0.5401773958281779,0.612435672641512,0.6526811142645437,0.3624953128552123,0.49343517980358187,0.08976077337316268,0.5131744093132533,0.5401773958281779,0.630730626931145,0.5537128237602567,0.5537128237602567,0.6683838745430969,0.6455633786666964,0.6694532939323736,0.5069393959070461,0.6650681415950892,0.4700778529755044,0.5003697264549156,0.3624953128552122,0.5131744093132533,0.08976077337316268,0.08976077337316268,0.55786704598957,0.5797517914627266,0.18285661391771946,0.5401773958281779,0.4612933886746089,0.5069393959070461,0.4418893734487528,0.08976077337316268,0.5975703956181553,0.4519194387585651,0.5401773958281779,0.5131744093132533,0.6566347548219382,0.6735643522315944,0.6566347548219382,0.6325279535014523,0.612435672641512,0.6639253693369189]
fScore = [0.5074245791799441,0.49421263711212904,0.24870651952630207,0.2317254950036931,0.4898603738982631,0.4484133871278784,0.42079769875995765,0.4300583986464786,0.37082882191119654,0.5115670220848189,0.40829204836592786,0.3748678859825422,0.587113901253977,0.39994176647786095,0.37215074140255583,0.6769179653086436,0.6344238193798317,0.45798790025233205,0.45222089965620266,0.33997917471905703,0.2898752869727751,0.33821108313774945,0.3687036150466504,0.44715681622991055,0.49681272583252767,0.4312750117970875,0.26463935213904827,0.6296818219699349,0.40658860917837114,0.5624541269475115,0.35707412865335053,0.5334765071327272,0.5018198920050383,0.36529658748282434,0.482379260168203,0.34964356553839177,0.2716766286216051,0.3519399958397691,0.6087818346181587,0.6921269104992803,0.43231845353339365,0.6276949813166705,0.39999894658633073,0.6255874744304819,0.44078312771199846,0.31981594476382175,0.2960981824567999,0.6913265663400588,0.6213695776424195,0.47719287836962404,0.6398865642916196,0.31999947329316536,0.3893670625686439,0.34007268148598374,0.45285224402702823,0.4149256918975238,0.3799978931726614,0.4398230273293408,0.5787205548148614,0.6175783662619583,0.44223651019233196,0.5575577023326996,0.39494227678644794,0.5859694550136071,0.4255812031548955,0.38639469366370444,0.37820638990949484,0.4999877540660945,0.6310927580650049,0.3521208661303776,0.7555531385519073,0.4784704642975367,0.5266894611255359,0.44531980599984544,0.2693150918891541,0.4086946393086973,0.4811302950161595,0.42766049709274034,0.26345836390307126,0.4692897714827569,0.2938048456026904,0.28606936220171403,0.5192209186368266,0.3863391806763046,0.31930881688936485,0.21400572926308664,0.42690590372994086,0.4189169604675727,0.42198472097170575,0.4036736670887577,0.34987830018818905,0.4604841854590651,0.4454424749429055,0.4091804131684581,0.4590271826777238,0.5102721446049516,0.5100480826349465]
finalScore = [0.5159395298411629,0.5548807073274225,0.3385729713376753,0.2705685062494677,0.46463998367719767,0.5324803196106961,0.47117874655895353,0.4625573915597773,0.4111436558271983,0.5180722882418443,0.46844607510800523,0.47074726231827063,0.5571667313441429,0.4722330844787992,0.43904728846386426,0.5486815449154974,0.5341807381436506,0.49766978861994193,0.46097650891202274,0.3880375472660885,0.39202013505707023,0.42111689090043836,0.4349198608284305,0.44952551311741246,0.5390299408344151,0.39390530351837244,0.35304063430195476,0.6328263326078651,0.47177743772712133,0.581933968214037,0.3675527941939807,0.5163930288120501,0.5393586158050172,0.40401711051832534,0.5117284585543405,0.42986742100514447,0.3772205767517408,0.4503296153873404,0.6017250315982665,0.6637901676088943,0.5052416303159439,0.5429272120774371,0.4539580298280183,0.5850168227511857,0.42989841188755185,0.40655858264407696,0.28711056180288913,0.5654351255287001,0.6268991166378248,0.5067354784838923,0.6194240093328278,0.3859373680084638,0.4139689267114163,0.32056666739560136,0.5015014465566273,0.45078765447736985,0.4039504671076259,0.4848619488602841,0.5951009684369715,0.6346447201015348,0.3984151179981246,0.5235403393830658,0.1462764642823502,0.5471613656987018,0.4760803502566865,0.47921522047026727,0.4494332235007902,0.5254806478716965,0.6492032442091445,0.4556879337799015,0.7099021110560453,0.4922936900184857,0.5878450119534815,0.45736402368822865,0.3501618211690294,0.3842111550409993,0.4966359987487896,0.14837865836335073,0.13390116219594173,0.5097591605816495,0.3899778866103079,0.22310418949571695,0.5294918820602299,0.4205022701485284,0.3918198338822267,0.28835970028596397,0.14833317407354912,0.49254399929132053,0.4364393878731123,0.46205465845114196,0.41607792445103026,0.5413388123958119,0.5362508338737213,0.5041813784380874,0.5319887467654554,0.5567055992855113,0.5769020774263806]

plt.figure(figsize=(8,5))
plt.scatter(level, chScore)
plt.show()
print('CH Score : ')
print(stats.spearmanr(level, chScore))

plt.figure(figsize=(8,5))
plt.scatter(level, fScore)
plt.show()
print('Features Score : ')
print(stats.spearmanr(level, fScore))

plt.figure(figsize=(8,5))
plt.scatter(level, finalScore)
plt.show()
print('Final Score : ')
print(stats.spearmanr(level, finalScore))