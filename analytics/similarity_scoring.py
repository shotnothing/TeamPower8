import pandas as pd
import numpy as np

class SimilarityScoringPipeline:
    ''' Pipeline for computing similarity scores between labels.'''
    
    def __init__(self):
        pass

    @staticmethod
    def get_distance_metrics():
        ''' Returns a dictionary of distance metrics.

        Returns:
            dict: Dictionary of distance metrics.
        '''
        return {
            'L1': SimilarityScoringPipeline.L1Norm,
            'L2': SimilarityScoringPipeline.L2Norm,
            'LInf': SimilarityScoringPipeline.LInfNorm,
            'cosine': SimilarityScoringPipeline.cosine_similarity,
            'jaccard': SimilarityScoringPipeline.jaccard_similarity,
            'overlap': SimilarityScoringPipeline.overlap_similarity
        }
    
    @staticmethod
    def LNNorm(n, labels1, labels2 = None):
        ''' Returns the L-n norm of the labels. Takes in either one or two label vectors.
        
        Args:
            n (int): The order of the norm.
            labels1 (np.array): The first label vector.
            labels2 (np.array): The second label vector (optional).

        Returns:
            float: The L-n norm of the labels.
        '''
        if labels2 is None:
            return np.linalg.norm(labels1, ord=n)
        return np.linalg.norm(labels1 - labels2, ord=n)
    
    @staticmethod
    def L1Norm(labels1, labels2 = None):
        ''' Returns the L-1 norm of the labels. Takes in either one or two label vectors.
        
        Args:
            labels1 (np.array): The first label vector.
            labels2 (np.array): The second label vector (optional).
            
        Returns:
            float: The L-1 norm of the labels.
        '''
        return SimilarityScoringPipeline.LNNorm(1, labels1, labels2)
    
    @staticmethod
    def L2Norm(labels1, labels2 = None):
        ''' Returns the L-2 norm of the labels. Takes in either one or two label vectors.

        Args:
            labels1 (np.array): The first label vector.
            labels2 (np.array): The second label vector (optional).

        Returns:
            float: The L-2 norm of the labels.
        '''
        return SimilarityScoringPipeline.LNNorm(2, labels1, labels2)
    
    @staticmethod
    def LInfNorm(labels1, labels2 = None):
        ''' Returns the L-infinity norm of the labels. Takes in either one or two label vectors.

        Args:
            labels1 (np.array): The first label vector.
            labels2 (np.array): The second label vector (optional).

        Returns:
            float: The L-infinity norm of the labels.
        '''
        return SimilarityScoringPipeline.LNNorm(np.inf, labels1, labels2)
    
    @staticmethod
    def cosine_similarity(labels1, labels2):
        ''' Returns the cosine similarity of the labels.
        
        Args:
            labels1 (np.array): The first label vector.
            labels2 (np.array): The second label vector.
            
        Returns:
            float: The cosine similarity of the labels.
        '''
        return np.dot(labels1, labels2) \
            / (SimilarityScoringPipeline.L2Norm(labels1) \
                * SimilarityScoringPipeline.L2Norm(labels2))
    
    @staticmethod
    def jaccard_similarity(labels1, labels2):
        ''' Returns the Jaccard similarity of the labels.
        
        Args:
            labels1 (np.array): The first label vector.
            labels2 (np.array): The second label vector.
            
        Returns:
            float: The Jaccard similarity of the labels.
        '''
        return np.dot(labels1, labels2) \
            / (SimilarityScoringPipeline.L1Norm(labels1) \
               + SimilarityScoringPipeline.L1Norm(labels2) \
               - np.dot(labels1, labels2))
    
    @staticmethod
    def overlap_similarity(labels1, labels2):
        ''' Returns the overlap similarity of the labels.

        Args:
            labels1 (np.array): The first label vector.
            labels2 (np.array): The second label vector.

        Returns:
            float: The overlap similarity of the labels.
        '''
        return np.dot(labels1, labels2) \
            / min(
                SimilarityScoringPipeline.L1Norm(labels1), 
                SimilarityScoringPipeline.L1Norm(labels2))
    
    def get_similarity_matrix(self, label_df, similarity_heuristic = None):
        ''' Returns the similarity matrix of the labels.
        
        Args:
            label_df (pd.DataFrame): DataFrame containing the label membership scores.
            similarity_heuristic (function): Function to use as the similarity heuristic. Defaults to L2Norm.
            
        Returns:
            np.array: The similarity matrix of the labels.
            pd.DataFrame: DataFrame containing the pairwise similarities.
        '''
        if similarity_heuristic is None:
            similarity_heuristic = SimilarityScoringPipeline.L2Norm
        elif type(similarity_heuristic) is str:
            similarity_heuristic = self.get_distance_metrics()[similarity_heuristic]

        labels = label_df.drop(columns=['title', 'id'])

        if similarity_heuristic(labels.iloc[0], labels.iloc[0]) == 0:
            similarity_matrix = np.ones((len(label_df), len(label_df)))
        else:
            similarity_matrix = np.zeros((len(label_df), len(label_df)))

        pairs = []
        for i in range(len(label_df)):
            for j in range(i, len(label_df)):
                similarity = similarity_heuristic(labels.iloc[i], labels.iloc[j])
                i_id, j_id = label_df.loc[i, 'id'], label_df.loc[j, 'id']
                i_id, j_id = min(i_id, j_id), max(i_id, j_id)

                similarity_matrix[
                    i_id, 
                    j_id
                ] = similarity
                pairs.append((
                        i_id, 
                        j_id, 
                        similarity
                    ))

        return similarity_matrix, pd.DataFrame(
            pairs, columns=['label1', 'label2', 'similarity'])

        

    
    

    
