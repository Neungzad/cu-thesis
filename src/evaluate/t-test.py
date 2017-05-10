# -*- coding: utf-8 -*-
"""
Created on Thu Apr  6 13:13:03 2017

@author: admin
"""

from scipy import stats

rvs1 = [56,75,45,71,62,64,58,80,76,61]
rvs2 = [66,70,40,60,65,56,59,77,67,63]
print(stats.ttest_ind(rvs1,rvs2))
