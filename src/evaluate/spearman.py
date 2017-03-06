# -*- coding: utf-8 -*-
import matplotlib.pyplot as plt
from scipy import stats

level = [2,2,1,1,1,2,2,2,1,2,1,2,2,2,1,2,2,2,1,2,1,2,2,1,1,2,1,3,2,2,2,2,2,1,2,1,1,1,2,3,1,2,2,2,2,1,1,2,3,2,3,1,1,1,2,1,1,2,2,3,1,2,1,2,2,1,1,2,2,1,3,1,2,1,2,1,1,1,1,2,1,1,2,1,2,1,1,2,2,2,2,3,3,3,3,3,3]
chScore = [0.6432852490850193,0.7443777813646686,0.6998983714995869,0.7250924222575064,0.6540237437388063,0.7572248179465564,0.7324536135809461,0.6210768183100488,0.6540237437388063,0.7240877669919468,0.668920751981844,0.7395461856056854,0.6764845468513275,0.48610165763024926,0.6948563211344785,0.61012875474872,0.5829676085757537,0.7198512844592404,0.2786524795555183,0.6572725920498694,0.7380630297361781,0.6873703678837525,0.7127460403942363,0.6540237437388063,0.7030257956266299,0.37866506544038814,0.6740603825479794,0.6393262397777592,0.61012875474872,0.6740603825479794,0.6853420195558751,0.630730626931145,0.7127460403942363,0.6393262397777592,0.6470438761352388,0.7164215079486667,0.705985896204794,0.7074078495525694,0.7395461856056854,0.7289149693181832,0.7101438811835017,0.5327247273671767,0.5558105792332295,0.6260492100113992,0.6873703678837525,0.7577011294753189,0.2786524795555183,0.6572725920498694,0.7279874283293453,0.7175906559525725,0.6633466435101647,0.08976077337316268,0.4418893734487528,0.5036981979753681,0.6470438761352388,0.6260492100113992,0.6432852490850193,0.7298248003015797,0.6393262397777592,0.689332532720194,0.5747169674625543,0.6740603825479794,0.6633466435101647,0.6260492100113992,0.650618512955226,0.730717491935609,0.7493096015610031,0.6432852490850193,0.7772151901759699,0.7437193735882803,0.7774929007162992,0.6912320828479565,0.7796367346795867,0.668920751981844,0.6351483518662706,0.37866506544038814,0.6351483518662706,0.5975703956181553,0.61012875474872,0.7469151307226831,0.6832436279385435,0.3351405970574889,0.5448803866865813,0.6393262397777592,0.6157820866649879,0.7030257956266299,0.4418893734487528,0.5747169674625543,0.5747169674625543,0.6260492100113992,0.2786524795555183,0.6965869244577209,0.7423718758584289,0.6998983714995869,0.6470438761352388,0.7087933237800376,0.6540237437388063]
fScore = [0.5074245791799441,0.49421263711212904,0.24870651952630207,0.2317254950036931,0.4898603738982631,0.4484133871278784,0.42079769875995765,0.4300583986464786,0.37082882191119654,0.5115670220848189,0.40829204836592786,0.3748678859825422,0.587113901253977,0.39994176647786095,0.37215074140255583,0.6769179653086436,0.6344238193798317,0.45798790025233205,0.45222089965620266,0.33997917471905703,0.2898752869727751,0.33821108313774945,0.3687036150466504,0.44715681622991055,0.49681272583252767,0.4312750117970875,0.26463935213904827,0.6296818219699349,0.40658860917837114,0.5624541269475115,0.35707412865335053,0.5334765071327272,0.5018198920050383,0.36529658748282434,0.482379260168203,0.34964356553839177,0.2716766286216051,0.3519399958397691,0.6087818346181587,0.6921269104992803,0.43231845353339365,0.6276949813166705,0.39999894658633073,0.6255874744304819,0.44078312771199846,0.31981594476382175,0.2960981824567999,0.6913265663400588,0.6213695776424195,0.47719287836962404,0.6398865642916196,0.31999947329316536,0.3893670625686439,0.34007268148598374,0.45285224402702823,0.4149256918975238,0.3799978931726614,0.4398230273293408,0.5787205548148614,0.6175783662619583,0.44223651019233196,0.5575577023326996,0.39494227678644794,0.5859694550136071,0.4255812031548955,0.38639469366370444,0.37820638990949484,0.4999877540660945,0.6310927580650049,0.3521208661303776,0.7555531385519073,0.4784704642975367,0.5266894611255359,0.44531980599984544,0.2693150918891541,0.4086946393086973,0.4811302950161595,0.42766049709274034,0.26345836390307126,0.4692897714827569,0.2938048456026904,0.28606936220171403,0.5192209186368266,0.3863391806763046,0.31930881688936485,0.21400572926308664,0.42690590372994086,0.4189169604675727,0.42198472097170575,0.4036736670887577,0.34987830018818905,0.4604841854590651,0.4454424749429055,0.4091804131684581,0.4590271826777238,0.5102721446049516,0.5100480826349465]
finalScore = [0.5673345943378351,0.594031571450914,0.3670006124668788,0.35121081543287924,0.5601621889952378,0.563269717239498,0.5345145359820208,0.5082111180562151,0.47329901396849017,0.5995516319972827,0.5070771976214361,0.4975387914643857,0.6286387610485771,0.43883256813548027,0.48470399898496125,0.6417904009302665,0.6076082487757583,0.5598101719534216,0.3448271029707993,0.4481496064621118,0.41626278361476127,0.4533550726901421,0.4859995846896922,0.5311593495572056,0.5821986135785802,0.4032613897115896,0.38006381880904877,0.6344673822513301,0.48798498110592475,0.6132205341134526,0.46952055545732735,0.5780414188363874,0.5889678468275601,0.46493805902434215,0.5527079023510025,0.4699378615757717,0.39236416097544136,0.4700346854178854,0.6678230770330595,0.7100447536362212,0.5374501988733499,0.5763236099651106,0.4652049183213536,0.6258182570525569,0.5371277256777018,0.44978387510541323,0.28711056180288913,0.6738696244683345,0.6704663611899042,0.5732070132677474,0.6514054462532641,0.140196129007063,0.4139689267114163,0.4060201673574996,0.5328053548339838,0.4990781259942524,0.47777008975645174,0.5488724819655052,0.6075156354163366,0.6514856670031781,0.49984749867822786,0.6102988625136382,0.49510795901203436,0.6053466419091988,0.5145717944233342,0.5054915076406513,0.5026867582805793,0.5626560690707649,0.6965733291370189,0.4779512569333665,0.7663660272309071,0.5655012659837815,0.6286736849963944,0.5346846466285616,0.3782464353360075,0.3931071946037214,0.5475140365103335,0.4985359966323805,0.36800799843384085,0.5764154220694828,0.41091162629411565,0.30866683773861975,0.5317412797207526,0.48163225694253453,0.42054659885424217,0.3281273195093967,0.4342684341779557,0.4846023839787493,0.48664867726545835,0.49084969558997243,0.3102296944944005,0.5544469302900801,0.5567940233880772,0.5164370805485182,0.53705541821153,0.5933684429369652,0.5731322568485613]

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