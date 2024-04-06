import pandas as pd
import numpy as np

class SimilarityScoringPipeline:
    def __init__(self):
        pass

    def LNNorm(self, n, labels):
        return np.linalg.norm(labels, ord=n, axis=1)
    
    def L1Norm(self, labels):
        return self.LNNorm(1, labels)
    
    def L2Norm(self, labels):
        return self.LNNorm(2, labels)
    
    def LInfNorm(self, labels):
        return self.LNNorm(np.inf, labels)
    
    def cosine_similarity(self, labels):
        return np.dot(labels, labels.T) / (self.L2Norm(labels) * self.L2Norm(labels).T)
    
    def jaccard_similarity(self, labels):
        return np.dot(labels, labels.T) / (self.L1Norm(labels) 
                                           + self.L1Norm(labels).T 
                                           - np.dot(labels, labels.T))
    
    def overlap_similarity(self, labels):
        return np.dot(labels, labels.T) / np.minimum(
            self.L1Norm(labels), self.L1Norm(labels).T)
    
    def get_similarity_matrix(self, label_df, similarity_heuristic = None):
        if similarity_heuristic is None:
            similarity_heuristic = self.L2Norm

        

    
    

    
