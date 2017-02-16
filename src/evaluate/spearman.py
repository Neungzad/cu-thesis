# -*- coding: utf-8 -*-
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

level = [2 ,2 ,1,1,1,2 ,2 ,2 ,1,2 ]
chScore = [0.668920751981844 ,0.7373026889861369 ,0.6912320828479565 ,0.7260767965928208 ,0.668920751981844 ,0.7537214541855055 ,0.7279874283293453 ,0.6603767281048913 ,0.6540237437388063 ,0.7240877669919468 ]
fScore = [0.5074245791799441 ,0.49421263711212904 ,0.24870651952630207 ,0.2317254950036931 ,0.4898603738982631 ,0.4484133871278784 ,0.42079769875995765 ,0.4300583986464786 ,0.37082882191119654 ,0.5115670220848189 ]
finalScore = [0.5881726655808941 ,0.615757663049133 ,0.46996930118712926 ,0.47890114579825693 ,0.5793905629400535 ,0.6010674206566919 ,0.5743925635446514 ,0.5452175633756849 ,0.5124262828250015 ,0.6178273945383828 ]

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
    